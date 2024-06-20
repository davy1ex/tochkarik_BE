<?php
namespace App\Controller;

use App\Entity\Points;
use App\Repository\PointsRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;


#[Route('/api/points')]
class ApiPointController extends AbstractController
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    #[Route('/add_point', name: 'apiPointAdd', methods: ['POST'])]
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
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            $data = json_decode($request->getContent(), true);

            return $this->json(['error' => 'Internal Server Error', 'time' => $data['timeOfGenerate']], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/get_points', name: 'apiGetPoints', methods: ['GET'])]
    public function apiGetPoints(): JsonResponse
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
        } catch (\Exception $e) {
            return $this->json(['error' => 'Internal Server Error'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
