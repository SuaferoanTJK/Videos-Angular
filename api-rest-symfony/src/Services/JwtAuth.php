<?php
namespace App\Services;

use Firebase\JWT\JWT;
use App\Entity\User;

class JwtAuth{
    public $manager;
    public $key;

    public function __construct($manager){
        $this->manager = $manager;
        $this->key = "symfonyKey574891574693";
    }

    public function signup($email, $password, $getToken = null){
        $user = $this->manager->getRepository(User::class)->findOneBy([
            "email" => $email,
            "password" => $password,
        ]);

        $signup = false;
        if(is_object($user)){
            $signup = true;
        }

        if($signup){
            $token = [
                "id" => $user->getId(),
                "name" => $user->getName(),
                "surname" => $user->getSurname(),
                "email" => $user->getEmail(),
                "iat" => time(),
                "exp" => time()+(24*60*60),
            ];
            $jwt = JWT::encode($token, $this->key, "HS256");

            if(!empty($getToken)){
                $data = $jwt;
            } else {
                $decoded = JWT::decode( $jwt, $this->key, ["HS256"]);
                $data = $decoded;
            }
        } else {
            $data = [
                "status" => "error",
                "code" => 400,
                "message" => "Login failed"
            ];
        }
        return $data;
    }

    public function checkToken($jwt, $identity = false){
        $auth = false;
        try {
            $decoded = JWT::decode($jwt, $this->key, ["HS256"]);
        } catch (\UnexpectedValueException $e) {
            $auth = false;
        } catch (\DomainException $e) {
            $auth = false;
        } catch (\ErrorException $e) {
            $auth = false;
        }
        
        if(isset($decoded) && !empty($decoded) && is_object($decoded) && isset($decoded->id)){
            $auth = true;
        }

        if($identity){
            return $decoded;
        } else {
        return $auth;
        }
    }
}