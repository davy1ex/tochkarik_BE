<?php

namespace App\Controller\Api\Private;

use App\Controller\ConnectionException;
use App\Entity\Points;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;


#[Route('/api')]
class PointController extends AbstractController
{
    private $security;

    /**
     * Constructs a new instance of the class and initializes the security property.
     *
     * @param Security $security The security service to be used.
     */
    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * Adds a new point to the database.
     *
     * @param Request                $request The HTTP request.
     * @param EntityManagerInterface $entityManager The entity manager.
     * @return JsonResponse The JSON response.
     * @throws \Doctrine\DBAL\Exception\ConnectionException If there is a database connection error.
     * @throws \Doctrine\DBAL\Exception If there is a database error.
     * @throws \Exception If there is an internal server error.
     */
    #[Route('/points', name: 'apiAddPoint', methods: ['POST'])]
    public function apiPointAdd(
        Request                $request,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        try {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

            $data = json_decode($request->getContent(), true);
            $name = $data['name'];
            $coordinates = $data['coordinates'];
            $timeOfGenerate = $data['timeOfGenerate'];

            if (!($name || $coordinates || $timeOfGenerate)) {
                return $this->json(['error' => 'Invalid JSON data'], Response::HTTP_BAD_REQUEST);
            }

            $user = $this->security->getUser();
            if (!$user) {
                return $this->json(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $point = new Points();
            $point->setName($name);
            $point->setUsername($user);
            $point->setCoordinates($coordinates);
            $point->setTimeOfGenerate(new \DateTimeImmutable($timeOfGenerate));

            $entityManager->persist($point);
            $entityManager->flush();

            return $this->json([
                'status' => 'success',
                'data' => [
                    'id' => $point->getId(),
                    'name' => $point->getName(),
                    'coordinates' => $point->getCoordinates(),
                    'timeOfGenerate' => $point->getTimeOfGenerate()->format('Y-m-d H:i:s'),
                    'description' => $point->getDescription(),
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

    /**
     * Retrieves all points for the authenticated user and returns them in JSON format.
     *
     * @return JsonResponse The JSON response containing the points data.
     * @throws \Doctrine\DBAL\Exception\ConnectionException If there is a database connection error.
     * @throws \Doctrine\DBAL\Exception If there is a database error.
     * @throws \Exception If there is an internal server error.
     */
    #[Route('/points', name: 'apiGetPoints', methods: ['GET'])]
    public function apiGetAllPoints(): JsonResponse
    {
        try {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

            $user = $this->security->getUser();
            if (!$user) {
                return $this->json(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            $points = $user->getPoints();
            if ($points === null) {
                return $this->json(['points' => []], JsonResponse::HTTP_OK);
            }

            $pointsData = [];
            foreach ($points as $point) {
                $pointsData[] = [
                    'id' => $point->getId(),
                    'name' => $point->getName(),
                    'coordinates' => $point->getCoordinates(),
                    'timeOfGenerate' => $point->getTimeOfGenerate()->format('Y-m-d H:i:s'),
                    'description' => $point->getDescription(),
                ];
            }
            return $this->json(['points' => $pointsData], JsonResponse::HTTP_OK);
        } catch (\Doctrine\DBAL\Exception\ConnectionException $e) {
            return $this->json(['error' => 'Database connection error: ' . $e->getMessage()], JsonResponse::HTTP_SERVICE_UNAVAILABLE);
        } catch (\Doctrine\DBAL\Exception $e) {
            return $this->json(['error' => 'Database error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Internal Server Error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves a point by its ID and returns it as a JSON response.
     *
     * @param Points $point The point object to retrieve.
     * @return JsonResponse The JSON response containing the point data.
     * @throws ConnectionException If there is a database connection error.
     * @throws \Doctrine\DBAL\Exception If there is a database error.
     * @throws \Exception If there is an internal server error.
     */
    #[Route('/points/{id}', name: 'apiGetPoint', methods: ['GET'])]
    public function apiGetPointById(Points $point): JsonResponse
    {
        try {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

            $user = $this->security->getUser();
            if (!$user || $point->getUsername() !== $user) {
                return $this->json(['error' => 'Unauthorized access'], JsonResponse::HTTP_FORBIDDEN);
            }

            return $this->json([
                'id' => $point->getId(),
                'name' => $point->getName(),
                'coordinates' => $point->getCoordinates(),
                'timeOfGenerate' => $point->getTimeOfGenerate()->format('Y-m-d H:i:s'),
                'description' => $point->getDescription(),
            ], JsonResponse::HTTP_OK);
        } catch (ConnectionException $e) {
            return $this->json(['error' => 'Database connection error: ' . $e->getMessage()], JsonResponse::HTTP_SERVICE_UNAVAILABLE);
        } catch (\Doctrine\DBAL\Exception $e) {
            return $this->json(['error' => 'Database error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Internal Server Error: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Updates a point in the database.
     *
     * @param Request $request The HTTP request object.
     * @param Points $point The point to be updated.
     * @param EntityManagerInterface $entityManager The entity manager.
     * @throws ConnectionException If there is a database connection error.
     * @throws \Doctrine\DBAL\Exception If there is a database error.
     * @throws \Exception If there is an internal server error.
     * @return JsonResponse The JSON response containing the updated point data or an error message.
     */
    #[Route('/points/{id}', name: 'api_points_update', methods: ['PUT'])]
    public function update(
        Request                $request,
        Points                 $point,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        try {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

            $user = $this->security->getUser();
            if (!$user || $point->getUsername() !== $user) {
                return $this->json(['error' => 'Unauthorized access'], JsonResponse::HTTP_FORBIDDEN);
            }

            $data = json_decode($request->getContent(), true);
            $name = $data['name'];
            $coordinates = $data['coordinates'];
            $timeOfGenerate = $data['timeOfGenerate'];

            if (!empty($name)) {
                $point->setName($data['name']);
            }
            if (!empty($coordinates)) {
                $point->setCoordinates($data['coordinates']);
            }
            if (!empty($timeOfGenerate)) {
                $point->setTimeOfGenerate(new \DateTimeImmutable($data['timeOfGenerate']));
            }
            if (!empty($description)) {
                $point->setDescription($data['description']);
            }

            $entityManager->flush();

            return $this->json([
                'status' => 'success',
                'data' => [
                    'id' => $point->getId(),
                    'name' => $point->getName(),
                    'coordinates' => $point->getCoordinates(),
                    'timeOfGenerate' => $point->getTimeOfGenerate()->format('Y-m-d H:i:s'),
                    'description' => $point->getDescription(),
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

    /**
     * Deletes a point by its ID and returns a JSON response indicating the status of the deletion.
     *
     * @param Points $point The point object to delete.
     * @param EntityManagerInterface $entityManager The entity manager used to delete the point.
     * @return JsonResponse The JSON response indicating the status of the deletion.
     * @throws ConnectionException If there is a database connection error.
     * @throws \Doctrine\DBAL\Exception If there is a database error.
     * @throws \Exception If there is an internal server error.
     */
    #[Route('/points/{id}', name: 'api_points_delete', methods: ['DELETE'])]
    public function delete(
        Points                 $point,
        EntityManagerInterface $entityManager
    ): JsonResponse
    {
        try {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

            $user = $this->security->getUser();
            if (!$user || $point->getUsername() !== $user) {
                return $this->json(['error' => 'Unauthorized access'], JsonResponse::HTTP_FORBIDDEN);
            }

            $entityManager->remove($point);
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
}
