<?php

namespace App\Entity;

use App\Repository\PostsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PostsRepository::class)]
class Posts
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $Title = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $Body = null;

    #[ORM\Column(length: 255)]
    private ?string $Coordinates = null;

    #[ORM\Column(length: 255)]
    private ?string $Author = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $Data_creation = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->Title;
    }

    public function setTitle(string $Title): static
    {
        $this->Title = $Title;

        return $this;
    }

    public function getBody(): ?string
    {
        return $this->Body;
    }

    public function setBody(string $Body): static
    {
        $this->Body = $Body;

        return $this;
    }

    public function getCoordinates(): ?string
    {
        return $this->Coordinates;
    }

    public function setCoordinates(string $Coordinates): static
    {
        $this->Coordinates = $Coordinates;

        return $this;
    }

    public function getAuthor(): ?string
    {
        return $this->Author;
    }

    public function setAuthor(string $Author): static
    {
        $this->Author = $Author;

        return $this;
    }

    public function getDataCreation(): ?\DateTimeInterface
    {
        return $this->Data_creation;
    }

    public function setDataCreation(\DateTimeInterface $Data_creation): static
    {
        $this->Data_creation = $Data_creation;

        return $this;
    }
}
