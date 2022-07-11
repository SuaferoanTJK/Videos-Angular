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

class UserController extends AbstractController
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
        $user_repo = $this->getDoctrine()->getRepository(User::class);
        $video_repo = $this->getDoctrine()->getRepository(Video::class);

        $users = $user_repo->findAll();
        $user = $user_repo->find(1);

        $videos = $video_repo->findAll();
        $data = [
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/UserController.php',
        ];

        return $this->resjson($data);
    }

    public function register(Request $request){
        $json = $request->get("json", null);
        $params = json_decode($json);
        $data = [
            "status" => "error",
            "code" => 400,
            "message" => "User was not created",
        ];
        if($json != null){
            $name = (!empty($params->name)) ? $params->name : null;
            $surname = (!empty($params->surname)) ? $params->surname : null;
            $email = (!empty($params->email)) ? $params->email : null;
            $password = (!empty($params->password)) ? $params->password : null;

            $validator = Validation::createValidator();
            $validate_email = $validator->validate($email, [
                new Email()
            ]);
            if(!empty($email) && count($validate_email) == 0 && !empty($password) && !empty($name) && !empty($surname)){
                $user = new User();
                $user->setName($name);
                $user->setSurname($surname);
                $user->setEmail($email);
                $user->setRole("ROLE_USER");
                $user->setCreatedAt(new \Datetime("now"));
                
                $pwd = hash("sha256", $password);
                $user->setPassword($pwd);

                $doctrine = $this->getDoctrine();
                $em = $doctrine->getManager();
                $user_repo = $doctrine->getRepository(User::class);
                $isset_user = $user_repo->findBy(array(
                    "email" => $email
                ));
                if(count($isset_user) == 0){
                    $em->persist($user);
                    $em->flush();
                    $data = [
                        "status" => "success",
                        "code" => 200,
                        "user" => $user,
                ];
                } else {
                    $data = [
                        "status" => "error",
                        "code" => 400,
                        "message" => "User already exists in our DB",
                ];
                }               
            } else {
                $data = [
                    "status" => "error",
                    "code" => 400,
                    "message" => "User registration failed",
                ];
            }
        }
        return $this->resjson($data);
    }

    public function login(Request $request, JwtAuth $jwt_auth){
        $json = $request->get("json", null);
        $params = json_decode($json);
        $data = [
            "status" => "error",
            "code" => 400,
            "message" => "Login failed",
        ];
        if(!empty($json)){
            $email = (!empty($params->email)) ? $params->email : null;
            $password = (!empty($params->password)) ? $params->password : null;
            $getToken = (!empty($params->getToken)) ? $params->getToken : null;

            $validator = Validation::createValidator();
            $validate_email = $validator->validate($email, [
                new Email()
            ]);

            if(!empty($email) && !empty($password) && count($validate_email) == 0){
                $pwd = hash("sha256", $password);
                if($getToken){
                    $signup = $jwt_auth->signup($email,$pwd,$getToken);
                } else {
                    $signup = $jwt_auth->signup($email,$pwd);
                }
                return new JsonResponse($signup);
            }
        }
        return $this->resjson($data);
    }

    public function update(Request $request, JwtAuth $jwt_auth){
        $token = $request->headers->get("Authorization");
        $checkToken = $jwt_auth->checkToken($token);
        $data = [
            "status" => "error",
            "code" => 400,
            "message" => "Update failed",
        ];

        if($checkToken){
            $em = $this->getDoctrine()->getManager();
            $identity = $jwt_auth->checkToken($token,true);

            $user_repo =  $this->getDoctrine()->getRepository(User::class);
            $user = $user_repo->findOneBy([
                "id" => $identity->id
            ]);

            $json = $request->get("json", null);
            $params = json_decode($json);

            if(!empty($json)){
                $name = (!empty($params->name)) ? $params->name : null;
                $surname = (!empty($params->surname)) ? $params->surname : null;
                $email = (!empty($params->email)) ? $params->email : null;

                $validator = Validation::createValidator();
                $validate_email = $validator->validate($email, [
                    new Email()
                ]);

                if(!empty($email) && count($validate_email) == 0 && !empty($name) && !empty($surname)){
                    $user->setName($name);
                    $user->setSurname($surname);
                    $user->setEmail($email);

                    $isset_user = $user_repo->findBy([
                        "email" => $email
                    ]);

                    if(count($isset_user) == 0 || $identity->email == $email){
                        $em->persist($user);
                        $em->flush();
                        $data = [
                            "status" => "success",
                            "code" => 200,
                            "user" => $user,
                        ];
                    } else {
                        $data = [
                            "status" => "error",
                            "code" => 400,
                            "message" => "That email can't be use, it is already attached to another user",
                        ];
                    }
                }
            }
        }        
        return $this->resjson($data);
    }
}
