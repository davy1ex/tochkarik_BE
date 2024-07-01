<?php

namespace App\Controller\Api\Public;

use App\Entity\User;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;


#[Route('/api/auth')]
class AuthController extends AbstractController
{
    /**
     * Checks the validity of the token.
     *
     * @return JsonResponse Returns a JSON response with the status of the token.
     */
    #[Route('/check_token', name: 'apiCheckToken', methods: ['GET'])]
    public function apiCheckToken()
    {
        return new JsonResponse(['status' => 'Token is valid']);
    }

    /**
     * Registers a new user based on the provided request data.
     *
     * @param Request                     $request The request object
     * @param UserPasswordHasherInterface $userPasswordHasher The user password hasher
     * @param EntityManagerInterface      $entityManager The entity manager
     * @return JsonResponse
     */
    #[Route('/signup', name: 'apiRegister', methods: ['POST'])]
    public function apiRegister(
        Request                     $request,
        UserPasswordHasherInterface $userPasswordHasher,
        EntityManagerInterface      $entityManager
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['username']) || empty($data['password'])) {
            return new JsonResponse(['message' => 'Invalid data'], Response::HTTP_BAD_REQUEST);
        }

        if (preg_match('/[А-Яа-яЁё]/u', $data['username']) || preg_match('/[А-Яа-яЁё]/u', $data['password'])) {
            return new JsonResponse(['message' => 'Username and password must not contain Cyrillic characters'], Response::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setUsername($data['username']);
        $user->setPassword(
            $userPasswordHasher->hashPassword(
                $user,
                $data['password']
            )
        );
        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setUpdatedAt(new \DateTimeImmutable());

        try {
            $entityManager->persist($user);
            $entityManager->flush();
        } catch (UniqueConstraintViolationException $e) {
            return new JsonResponse(['message' => 'Username already exists'], Response::HTTP_CONFLICT);
        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Internal Server Error'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse(['message' => 'User registered successfully'], Response::HTTP_CREATED);
    }
}