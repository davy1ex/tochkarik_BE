<?php

namespace App\Controller\Admin;

use App\Entity\Points;
use App\Entity\User;
use App\Entity\PointTelemetry;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class DashboardController extends AbstractDashboardController
{
    /**
     * Redirects the user to the 'admin' route.
     *
     * @return Response The HTTP response object.
     */
    #[Route('/', name: 'index')]
    public function index(): Response
    {
        return $this->redirectToRoute('admin');
    }

    /**
     * Redirects the user to the 'admin' route.
     *
     * @return Response The HTTP response object.
     */
    #[Route('/adminboard', name: 'admin')]
    public function admin(): Response
    {
        return $this->render('admin/index.html.twig');
    }

    /**
     * Configures the dashboard for the application.
     *
     * @return Dashboard The configured dashboard object.
     */
    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('Application');
    }

    /**
     * Configures the menu items for the application.
     *
     * @return iterable A collection of configured menu items.
     */
    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Dashboard', 'fa fa-home');
        yield MenuItem::linkToCrud('User', 'fas fa-list', User::class);
        yield MenuItem::linkToCrud('Points', 'fas fa-list', Points::class);
        yield MenuItem::linkToCrud('Point Telemetry', 'fas fa-list', PointTelemetry::class);
    }
}
