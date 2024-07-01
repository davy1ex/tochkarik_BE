<?php

namespace App\Controller\Api\Public;

use App\Repository\GenerationRulesRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/public/api')]
class GenerationRulesController extends AbstractController
{
    #[Route('/generation_rules', name: 'generationRules', methods: ['GET'])]
    public function index(GenerationRulesRepository $generationRulesRepository): JsonResponse
    {
        try {
            $generationRules = $generationRulesRepository->findAll();

            if (empty($generationRules)) {
                return $this->json(['error' => 'No generation rules found'], JsonResponse::HTTP_NOT_FOUND);
            }

            return $this->json([
                'status' => 'success',
                'data' => $generationRules,
            ], JsonResponse::HTTP_OK);
        } catch (\Doctrine\DBAL\Exception\ConnectionException $e) {
            return $this->json(['error' => 'Database connection error: ' . $e->getMessage()], JsonResponse::HTTP_SERVICE_UNAVAILABLE);
        } catch (\Doctrine\DBAL\Exception $e) {
            return $this->json(['error' => 'Database error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Internal Server Error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
