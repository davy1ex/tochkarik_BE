<?php

namespace App\Repository;

use App\Entity\GenerationRules;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method GenerationRules|null find($id, $lockMode = null, $lockVersion = null)
 * @method GenerationRules|null findOneBy(array $criteria, array $orderBy = null)
 * @method GenerationRules[]    findAll()
 * @method GenerationRules[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GenerationRulesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GenerationRules::class);
    }
}
