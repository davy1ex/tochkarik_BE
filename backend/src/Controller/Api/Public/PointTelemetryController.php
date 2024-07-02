<?php

namespace App\Controller\Api\Public;

use App\Entity\PointTelemetry;
use Doctrine\DBAL\Exception\ConnectionException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/public/api')]
class PointTelemetryController extends AbstractController
{
    /**
     * Adds a new telemetry record to the database.
     *
     * @param Request $request The HTTP request.
     * @param EntityManagerInterface $entityManager The entity manager.
     * @throws \Doctrine\DBAL\Exception\ConnectionException If there is a database connection error.
     * @throws \Doctrine\DBAL\Exception If there is a database error.
     * @throws \Exception If there is an internal server error.
     * @return JsonResponse The JSON response.
     */
    #[Route('/point_telemetry', name: 'apiAddTelemetry', methods: ['POST'])]
    public function addTelemetry(
        Request $request,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $coordinates = $data['coordinates'];
            $timeOfGenerate = $data['timeOfGenerate'];
            $description = $data['description'] ?? '';
            $isVisited = $data['isVisited'] ?? false;
            $generatedByRule = $data['generatedByRule'] ?? false;

            if (!($coordinates && $timeOfGenerate)) {
                return $this->json(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
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

    #[Route('/point_telemetry/{id}', name: 'apiUpdateTelemetry', methods: ['PUT'])]
    public function updateTelemetry(
        Request $request,
        PointTelemetry $telemetry,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        try {
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
}
