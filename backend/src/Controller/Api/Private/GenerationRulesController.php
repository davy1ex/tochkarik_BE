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


    /**
     * Creates a new generation rule based on the provided request data.
     *
     * @param Request $request The request object containing the data.
     * @param EntityManagerInterface $entityManager The entity manager for persisting the generation rule.
     * @throws AccessDeniedException If the user is not fully authenticated.
     * @return JsonResponse The JSON response with the status and the newly created generation rule data.
     */
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

    /**
     * Retrieves a generation rule by its ID and returns it as a JSON response.
     *
     * @param GenerationRules $generationRules The generation rule to retrieve.
     * @return JsonResponse The JSON response containing the status and the retrieved generation rule.
     * @throws AccessDeniedException If the user is not fully authenticated.
     */
    #[Route('/generation_rules/{id}', name: 'generationRulesShow', methods: ['GET'])]
    public function show(GenerationRules $generationRules): JsonResponse
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        return $this->json([
            'status' => 'success',
            'data' => $generationRules,
        ], JsonResponse::HTTP_OK);
    }

    /**
     * Updates a generation rule with the provided data.
     *
     * @param Request $request The request object containing the data.
     * @param GenerationRules $generationRules The generation rule to update.
     * @param EntityManagerInterface $entityManager The entity manager for persisting the changes.
     * @return JsonResponse The JSON response with the status and the updated generation rule.
     * @throws AccessDeniedException If the user is not fully authenticated.
     */
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

    /**
     * Deletes a generation rule.
     *
     * @param Request $request The request object.
     * @param GenerationRules $generationRules The generation rule to delete.
     * @param EntityManagerInterface $entityManager The entity manager.
     * @return JsonResponse The JSON response.
     */
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
