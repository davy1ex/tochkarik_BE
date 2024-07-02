<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Form\RegistrationFormType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;


#[Route('/admin/auth')]
class AuthController extends AbstractController
{
    /**
     * Renders the login page and handles user authentication.
     *
     * @param AuthenticationUtils $authenticationUtils The authentication utility service.
     * @return Response The HTTP response containing the login page.
     */
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
            'error' => $error,
        ]);
    }

    /**
     * Registers a new user by handling the registration form submission.
     *
     * @param Request $request The HTTP request object.
     * @param UserPasswordHasherInterface $userPasswordHasher The password hasher service.
     * @param Security $security The security service.
     * @param EntityManagerInterface $entityManager The entity manager service.
     * @return Response The HTTP response.
     */
    #[Route('/signup', name: 'appRegisterPage')]
    public function appRegisterPage(
        Request                     $request,
        UserPasswordHasherInterface $userPasswordHasher,
        Security                    $security,
        EntityManagerInterface      $entityManager): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // encode the plain password
            $user->setPassword(
                $userPasswordHasher->hashPassword(
                    $user,
                    $form->get('plainPassword')->getData()
                )
            );

            $entityManager->persist($user);
            $entityManager->flush();

            // do anything else you need here, like send an email

            return $security->login($user, 'form_login', 'main');
        }

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form,
        ]);
    }

    /**
     * Logs out the user from the application.
     *
     * @param AuthenticationUtils $authenticationUtils The authentication utility service.
     * @return Response The HTTP response.
     */
    #[Route('/logout', name: 'appLogout')]
    public function appLogout(AuthenticationUtils $authenticationUtils): Response
    {
        return $this->render();
    }
}
