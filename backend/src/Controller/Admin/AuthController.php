<?php

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;


#[Route('/admin/auth')]
class AuthController extends AbstractController
{
    #[Route('/signin', name: 'appLoginPage')]
    public function appLoginPage(AuthenticationUtils $authenticationUtils): Response
    {
        if ($this->getUser()) {
            $this->addFlash('info', 'U have logged in!');
            return $this->redirectToRoute('admin');
        }

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('login/index.html.twig', [
            'last_username' => $lastUsername,
            'error'         => $error,
        ]);
    }

    #[Route('/logout', name: 'appLogout')]
    public function appLogout(AuthenticationUtils $authenticationUtils): Response
    {
        return $this->render();
    }
}
