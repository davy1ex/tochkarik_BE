<?php

namespace App\Entity;

use App\Repository\PointTelemetryRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PointTelemetryRepository::class)]
class PointTelemetry
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $timeOfGenerate = null;

    #[ORM\Column]
    private array $coordinates = [];

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $visited = false;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $generatedByRule = false;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getTimeOfGenerate(): ?\DateTimeImmutable
    {
        return $this->timeOfGenerate;
    }

    public function setTimeOfGenerate(\DateTimeImmutable $timeOfGenerate): static
    {
        $this->timeOfGenerate = $timeOfGenerate;
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

    public function isVisited(): bool
    {
        return $this->visited;
    }

    public function setVisited(bool $visited): static
    {
        $this->visited = $visited;
        return $this;
    }

    public function isGeneratedByRule(): bool
    {
        return $this->generatedByRule;
    }

    public function setGeneratedByRule(bool $generatedByRule): void
    {
        $this->generatedByRule = $generatedByRule;
    }


    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function __toString(): string
    {
        return $this->name ?? 'null';
    }
}
