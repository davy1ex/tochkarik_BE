<?php

namespace App\Controller\Api\Private;

use App\Entity\PointTelemetry;
use Doctrine\DBAL\Exception\ConnectionException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

#[Route('/api')]
class PointTelemetryController extends AbstractController
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * Retrieves all point telemetry records and returns them as a JSON response.
     *
     * @param EntityManagerInterface $entityManager The entity manager used to retrieve the records.
     * @return JsonResponse The JSON response containing the telemetry data.
     * @throws ConnectionException If there is a database connection error.
     * @throws \Doctrine\DBAL\Exception If there is a database error.
     * @throws \Exception If there is an internal server error.
     */
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

    /**
     * Retrieves a specific point telemetry record by its ID and returns it as a JSON response.
     *
     * @param PointTelemetry $telemetry The point telemetry record to retrieve.
     * @return JsonResponse The JSON response containing the telemetry data.
     * @throws AccessDeniedException If the user is not authenticated.
     */
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

    /**
     * Deletes a point telemetry record.
     *
     * @param PointTelemetry $telemetry The telemetry record to be deleted.
     * @param EntityManagerInterface $entityManager The entity manager.
     * @return JsonResponse The JSON response indicating the status of the deletion.
     * @throws ConnectionException If there is a database connection error.
     * @throws \Doctrine\DBAL\Exception If there is a database error.
     * @throws \Exception If there is an internal server error.
     */
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

    /**
     * Retrieves analytics data for point telemetry.
     *
     * This function retrieves analytics data for point telemetry by querying the database
     * and calculating the total number of generated points, the number of visited points,
     * and the visit rate for points generated by rule and without rule. The analytics data
     * is returned in JSON format.
     *
     * @param EntityManagerInterface $entityManager The entity manager used to query the database.
     * @return JsonResponse The JSON response containing the analytics data.
     * @throws \Exception If there is an internal server error.
     */
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
