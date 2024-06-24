<?php

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LocationRulesDashboard extends AbstractController
{
    #[Route('/admin/location-rules', name: 'admin_location_rules')]
    public function index(): Response
    {
        return $this->render('admin/location_rules.html.twig');
    }
}