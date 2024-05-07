<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $Username = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Photo_profile = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Email = null;

    #[ORM\Column(length: 255)]
    private ?string $Password = null;

    #[ORM\Column(length: 255)]
    private ?string $Role = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $Date_registration = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $Last_time_visited = null;

    #[ORM\Column]
    private ?int $Posts_count = null;

    #[ORM\Column]
    private ?int $Comments_count = null;

    #[ORM\Column]
    private ?int $TochCoins = null;

    #[ORM\Column(type: Types::ARRAY, nullable: true)]
    private ?array $Bookmarked_posts = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->Username;
    }

    public function setUsername(string $Username): static
    {
        $this->Username = $Username;

        return $this;
    }

    public function getPhotoProfile(): ?string
    {
        return $this->Photo_profile;
    }

    public function setPhotoProfile(?string $Photo_profile): static
    {
        $this->Photo_profile = $Photo_profile;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->Email;
    }

    public function setEmail(?string $Email): static
    {
        $this->Email = $Email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->Password;
    }

    public function setPassword(string $Password): static
    {
        $this->Password = $Password;

        return $this;
    }

    public function getRole(): ?string
    {
        return $this->Role;
    }

    public function setRole(string $Role): static
    {
        $this->Role = $Role;

        return $this;
    }

    public function getDateRegistration(): ?\DateTimeInterface
    {
        return $this->Date_registration;
    }

    public function setDateRegistration(\DateTimeInterface $Date_registration): static
    {
        $this->Date_registration = $Date_registration;

        return $this;
    }

    public function getLastTimeVisited(): ?\DateTimeInterface
    {
        return $this->Last_time_visited;
    }

    public function setLastTimeVisited(\DateTimeInterface $Last_time_visited): static
    {
        $this->Last_time_visited = $Last_time_visited;

        return $this;
    }

    public function getPostsCount(): ?int
    {
        return $this->Posts_count;
    }

    public function setPostsCount(int $Posts_count): static
    {
        $this->Posts_count = $Posts_count;

        return $this;
    }

    public function getCommentsCount(): ?int
    {
        return $this->Comments_count;
    }

    public function setCommentsCount(int $Comments_count): static
    {
        $this->Comments_count = $Comments_count;

        return $this;
    }

    public function getTochCoins(): ?int
    {
        return $this->TochCoins;
    }

    public function setTochCoins(int $TochCoins): static
    {
        $this->TochCoins = $TochCoins;

        return $this;
    }

    public function getBookmarkedPosts(): ?array
    {
        return $this->Bookmarked_posts;
    }

    public function setBookmarkedPosts(?array $Bookmarked_posts): static
    {
        $this->Bookmarked_posts = $Bookmarked_posts;

        return $this;
    }
}
