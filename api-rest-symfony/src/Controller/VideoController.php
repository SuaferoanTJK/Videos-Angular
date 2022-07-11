<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints\Email;
use App\Entity\User;
use App\Entity\Video;
Use App\Services\JwtAuth;
use Knp\Component\Pager\PaginatorInterface;

class VideoController extends AbstractController
{
    public function resjson($data){
        $json = $this->get("serializer")->serialize($data, "json");
        $response = new Response();
        $response->setContent($json);
        $response->headers->set("Content-Type","application/json");
        return $response;
    }

    public function index(): Response
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/VideoController.php',
        ]);
    }

    public function upload(Request $request, JwtAuth $jwt_auth, $id=null){
        $token = $request->headers->get("Authorization");
        $checkToken = $jwt_auth->checkToken($token);
        $data = [
            "status" => "error",
            "code" => 400,
            "message" => "Request failed",
        ];

        if($checkToken){
            $json = $request->get("json", null);
            $params = json_decode($json);
            $identity = $jwt_auth->checkToken($token,true);

            if(!empty($json)){
                $user_id = ($identity->id != null) ? $identity->id : null;
                $title = ($params->title) ? $params->title : null;
                $description = ($params->description) ? $params->description : null;
                $url = ($params->url) ? $params->url : null;
            }
            if(!empty($user_id) && !empty($title)){
                $em = $this->getDoctrine()->getManager();
                $user = $this->getDoctrine()->getRepository(User::class)->findOneBy([
                    "id" => $user_id
                ]);

                if($id == null){
                    $video = new Video();
                    $video->setUser($user);
                    $video->setTitle($title);
                    $video->setDescription($description);
                    $video->setUrl($url);
                    $video->setStatus("normal");
                    $createdAt = new \Datetime("now");
                    $updatedAt = new \Datetime("now");
                    $video->setCreatedAt($createdAt);
                    $video->setUpdatedAt($updatedAt);

                    $em->persist($video);
                    $em->flush(); 
                    $data = [
                        "status" => "success",
                        "code" => 200,
                        "message" => "Video uploaded",
                        "video" => $video
                    ];
                } else{
                    $video = $this->getDoctrine()->getRepository(Video::class)->findOneBy([
                        "id" => $id,
                        "user" => $identity->id
                    ]);
                    if($video && is_object($video)){
                        $video->setTitle($title);
                        $video->setDescription($description);
                        $video->setUrl($url);
                        $updatedAt = new \Datetime("now");
                        $video->setUpdatedAt($updatedAt);

                        $em->persist($video);
                        $em->flush();
                        $data = [
                            "status" => "success",
                            "code" => 200,
                            "message" => "Video updated",
                            "video" => $video
                        ];
                    }
                }
            }
        }
        return $this->resjson($data);
    }

    public function obtain(Request $request, JwtAuth $jwt_auth, PaginatorInterface $paginator){
        $token = $request->headers->get("Authorization");
        $checkToken = $jwt_auth->checkToken($token);
        $data = [
            "status" => "error",
            "code" => 400,
            "message" => "Videos obtain failed",
        ];
        if($checkToken){
            $identity = $jwt_auth->checkToken($token,true);
            $em = $this->getDoctrine()->getManager();

            $dql = "SELECT v FROM App\Entity\Video v WHERE v.user = {$identity->id} ORDER BY v.id DESC";
            $query = $em->createQuery($dql);
            $page = $request->query->getInt("page", 1);
            $items_per_page = 8;
            $pagination = $paginator->paginate($query, $page, $items_per_page);
            $total = $pagination->getTotalItemCount();

            $data = [
                "status" => "success",
                "code" => 200,
                "message" => "Videos obtained",
                "total_items_count" => $total,
                "actual_page" => $page,
                "items_per_page" => $items_per_page,
                "total_pages" => ceil($total/$items_per_page),
                "videos" => $pagination,
                "user" => $identity->id
            ];
        }
        return $this->resjson($data);
    }

    public function detail(Request $request, JwtAuth $jwt_auth, $id = null){
        $token = $request->headers->get("Authorization");
        $checkToken = $jwt_auth->checkToken($token);
        $data = [
            "status" => "error",
            "code" => 404,
            "message" => "Video not found",
        ];
        if($checkToken){
            $identity = $jwt_auth->checkToken($token,true);
            $video = $this->getDoctrine()->getRepository(Video::class)->findOneBy([
                "id" => $id
            ]);
            if($video && is_object($video) && $identity->id == $video->getUser()->getId()){
                $data = [
                    "status" => "success",
                    "code" => 200,
                    "video" => $video
                ];
            }
        }
        return $this->resjson($data);
    }

    public function delete(Request $request, JwtAuth $jwt_auth, $id = null){
        $token = $request->headers->get("Authorization");
        $checkToken = $jwt_auth->checkToken($token);
        $data = [
            "status" => "error",
            "code" => 404,
            "message" => "Video not found",
        ];
        if($checkToken){
            $identity = $jwt_auth->checkToken($token,true);
            $doctrine = $this->getDoctrine();
            $em = $doctrine->getManager();
            $video = $doctrine->getRepository(Video::class)->findOneBy([
                "id" => $id
            ]);

            if($video && is_object($video) && $identity->id == $video->getUser()->getId()){
                $em->remove($video);
                $em->flush();
                $data = [
                    "status" => "success",
                    "code" => 200,
                    "video" => $video,
                ];
            }
        }
        return $this->resjson($data);
    }
}
