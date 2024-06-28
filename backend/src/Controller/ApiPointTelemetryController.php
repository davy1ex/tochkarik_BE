<?php

namespace App\Controller;

use App\Entity\PointTelemetry;
use Doctrine\DBAL\Exception\ConnectionException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

#[Route('/api')]
class ApiPointTelemetryController extends AbstractController
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    #[Route('/point_telemetry', name: 'apiAddTelemetry', methods: ['POST'])]
    public function addTelemetry(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        try {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

            $data = json_decode($request->getContent(), true);
            $coordinates = $data['coordinates'];
            $timeOfGenerate = $data['timeOfGenerate'];
            $description = $data['description'] ?? '';
            $isVisited = $data['isVisited'] ?? false;
            $generatedByRule = $data['generatedByRule'] ?? false;

            if (!($coordinates && $timeOfGenerate)) {
                return $this->json(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
            }

            $user = $this->security->getUser();
            if (!$user) {
                return $this->json(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $telemetry = new PointTelemetry();
            $telemetry->setCoordinates($coordinates);
            $telemetry->setTimeOfGenerate(new \DateTimeImmutable($timeOfGenerate));
            $telemetry->setDescription($description);
            $telemetry->setVisited($isVisited);
            $telemetry->setGeneratedByRule($generatedByRule);

            $entityManager->persist($telemetry);
            $entityManager->flush();

            return $this->json([
                'status' => 'success',
                'data' => [
                    'id' => $telemetry->getId(),
                    'coordinates' => $telemetry->getCoordinates(),
                    'timeOfGenerate' => $telemetry->getTimeOfGenerate()->format('Y-m-d H:i:s'),
                    'description' => $telemetry->getDescription(),
                ],
            ], Response::HTTP_CREATED);
        } catch (\Doctrine\DBAL\Exception\ConnectionException $e) {
            return $this->json(['error' => 'Database connection error: ' . $e->getMessage()], JsonResponse::HTTP_SERVICE_UNAVAILABLE);
        } catch (\Doctrine\DBAL\Exception $e) {
            return $this->json(['error' => 'Database error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Internal Server Error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/point_telemetry', name: 'apiGetAllTelemetry', methods: ['GET'])]
    public function getAllTelemetry(EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

            $telemetryRepository = $entityManager->getRepository(PointTelemetry::class);
            $telemetryRecords = $telemetryRepository->findAll();

            $telemetryData = [];
            foreach ($telemetryRecords as $telemetry) {
                $telemetryData[] = [
                    'id' => $telemetry->getId(),
                    'coordinates' => $telemetry->getCoordinates(),
                    'timeOfGenerate' => $telemetry->getTimeOfGenerate()->format('Y-m-d H:i:s'),
                    'description' => $telemetry->getDescription(),
                ];
            }
            return $this->json(['telemetry' => $telemetryData], JsonResponse::HTTP_OK);
        } catch (\Doctrine\DBAL\Exception\ConnectionException $e) {
            return $this->json(['error' => 'Database connection error: ' . $e->getMessage()], JsonResponse::HTTP_SERVICE_UNAVAILABLE);
        } catch (\Doctrine\DBAL\Exception $e) {
            return $this->json(['error' => 'Database error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Internal Server Error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/point_telemetry/{id}', name: 'apiGetTelemetry', methods: ['GET'])]
    public function getTelemetryById(PointTelemetry $telemetry): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        return $this->json([
            'id' => $telemetry->getId(),
            'coordinates' => $telemetry->getCoordinates(),
            'timeOfGenerate' => $telemetry->getTimeOfGenerate()->format('Y-m-d H:i:s'),
            'description' => $telemetry->getDescription(),
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/point_telemetry/{id}', name: 'apiUpdateTelemetry', methods: ['PUT'])]
    public function updateTelemetry(
        Request $request,
        PointTelemetry $telemetry,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        try {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

            $data = json_decode($request->getContent(), true);

            if (isset($data['coordinates'])) {
                $coordinates = $data['coordinates'];
                $telemetry->setCoordinates($coordinates);
            }

            if (isset($data['timeOfGenerate'])) {
                $timeOfGenerate = $data['timeOfGenerate'];
                $telemetry->setTimeOfGenerate(new \DateTimeImmutable($timeOfGenerate));
            }

            if (isset($data['visited'])) {
                $isVisited = $data['visited'];
                $telemetry->setVisited($isVisited);
            }

            if (isset($data['description'])) {
                $description = $data['description'];
                $telemetry->setDescription($description);
            }

            if (isset($data['generatedByRule'])) {
                $generatedByRule = $data['generatedByRule'];
                $telemetry->setGeneratedByRule($generatedByRule);
            }


            $entityManager->flush();

            return $this->json([
                'status' => 'success',
                'data' => [
                    'id' => $telemetry->getId(),
                    'coordinates' => $telemetry->getCoordinates(),
                    'timeOfGenerate' => $telemetry->getTimeOfGenerate()->format('Y-m-d H:i:s'),
                    'description' => $telemetry->getDescription(),
                ],
            ], JsonResponse::HTTP_OK);
        } catch (ConnectionException $e) {
            return $this->json(['error' => 'Database connection error: ' . $e->getMessage()], JsonResponse::HTTP_SERVICE_UNAVAILABLE);
        } catch (\Doctrine\DBAL\Exception $e) {
            return $this->json(['error' => 'Database error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Internal Server Error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/point_telemetry/{id}', name: 'apiDeleteTelemetry', methods: ['DELETE'])]
    public function deleteTelemetry(
        PointTelemetry $telemetry,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        try {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

            $entityManager->remove($telemetry);
            $entityManager->flush();

            return $this->json(['status' => 'success'], JsonResponse::HTTP_NO_CONTENT);
        } catch (ConnectionException $e) {
            return $this->json(['error' => 'Database connection error: ' . $e->getMessage()], JsonResponse::HTTP_SERVICE_UNAVAILABLE);
        } catch (\Doctrine\DBAL\Exception $e) {
            return $this->json(['error' => 'Database error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Internal Server Error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/point_telemetry_analytics', name: 'apiGetTelemetryAnalytics', methods: ['GET'])]
    public function getTelemetryAnalytics(EntityManagerInterface $entityManager): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        try {
            $telemetryRepository = $entityManager->getRepository(PointTelemetry::class);

            // Points generated by rule
            $generatedPointsByRule = $telemetryRepository->findBy(['generatedByRule' => true]);
            $totalGeneratedPointsByRule = count($generatedPointsByRule);
            $visitedPointsByRule = array_filter($generatedPointsByRule, function($point) {
                return $point->isVisited();
            });
            $totalVisitedPointsByRule = count($visitedPointsByRule);

            // Points not generated by rule
            $generatedPointsNotByRule = $telemetryRepository->findBy(['generatedByRule' => false]);
            $totalGeneratedPointsNotByRule = count($generatedPointsNotByRule);
            $visitedPointsNotByRule = array_filter($generatedPointsNotByRule, function($point) {
                return $point->isVisited();
            });
            $totalVisitedPointsNotByRule = count($visitedPointsNotByRule);

            // Total points
            $totalGeneratedPoints = $totalGeneratedPointsByRule + $totalGeneratedPointsNotByRule;
            $totalVisitedPoints = $totalVisitedPointsByRule + $totalVisitedPointsNotByRule;

            $analytics = [
                'totalGeneratedPoints' => $totalGeneratedPoints,
                'generatedByRule' => $totalGeneratedPointsByRule,
                'generatedWithoutRule' => $totalGeneratedPointsNotByRule,
                'totalVisitedPoints' => $totalVisitedPoints,
                'visitedByRule' => $totalVisitedPointsByRule,
                'visitedWithoutRule' => $totalVisitedPointsNotByRule,
                'visitRateByRule' => $totalGeneratedPointsByRule > 0 ? ($totalVisitedPointsByRule / $totalGeneratedPointsByRule) * 100 : 0,
            ];


            return $this->json(['analytics' => $analytics], JsonResponse::HTTP_OK);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Internal Server Error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
