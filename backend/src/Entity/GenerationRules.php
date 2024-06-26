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

    #[ORM\Column(type: "json")]
    private array $rules = [];

    #[ORM\Column(type: "string", length: 255)]
    private string $name;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRules(): ?array
    {
        return $this->rules;
    }

    public function setRules(array $rules): self
    {
        $this->rules = $rules;

        return $this;
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
}
