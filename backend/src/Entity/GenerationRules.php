<?php

namespace App\Entity;

use App\Repository\GenerationRulesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: "rules")]
#[ORM\Entity(repositoryClass: GenerationRulesRepository::class)]
class GenerationRules
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\Column(type: "string", length: 255)]
    private string $name;

    #[ORM\Column]
    private array $coordinates = [];

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getCoordinates(): array
    {
        return $this->coordinates;
    }

    public function setCoordinates(array $coordinates): static
    {
        $this->coordinates = $coordinates;

        return $this;
    }
}
