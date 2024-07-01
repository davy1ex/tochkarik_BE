<?php

namespace App\Controller\Api\Private;

use App\Entity\GenerationRules;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;


#[Route('/api')]
class GenerationRulesController extends AbstractController
{
    private Security $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }


    #[Route('/generation_rules', name: 'generationRulesNew', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $data = json_decode($request->getContent(), true);

        $generationRule = new GenerationRules();
        $generationRule->setName($data['name'] ?? '');
        $generationRule->setRules($data['rules'] ?? []);

        $entityManager->persist($generationRule);
        $entityManager->flush();

        return $this->json([
            'status' => 'success',
            'data' => $generationRule,
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/generation_rules/{id}', name: 'generationRulesShow', methods: ['GET'])]
    public function show(GenerationRules $generationRules): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        return $this->json([
            'status' => 'success',
            'data' => $generationRules,
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/generation_rules/{id}', name: 'generationRulesEdit', methods: ['PUT'])]
    public function edit(Request $request, GenerationRules $generationRules, EntityManagerInterface $entityManager): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $data = json_decode($request->getContent(), true);

        $generationRules->setName($data['name'] ?? $generationRules->getName());
        $generationRules->setRules($data['rules'] ?? $generationRules->getRules());

        $entityManager->flush();

        return $this->json([
            'status' => 'success',
            'data' => $generationRules,
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/generation_rules/{id}', name: 'generation_rule_delete', methods: ['DELETE'])]
    public function delete(Request $request, GenerationRules $generationRules, EntityManagerInterface $entityManager): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $entityManager->remove($generationRules);
        $entityManager->flush();

        return $this->json([
            'status' => 'success',
        ], JsonResponse::HTTP_NO_CONTENT);
    }
}
