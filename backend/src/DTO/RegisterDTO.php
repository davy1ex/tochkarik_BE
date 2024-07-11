<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class RegisterDTO
{
    #[Assert\NotBlank(message: 'Username is required')]
    #[Assert\Regex(pattern: '/^[A-Za-z0-9]+$/', message: 'Username must not contain Cyrillic characters')]
    public string $username;

    #[Assert\NotBlank(message: 'Password is required')]
    #[Assert\Regex(pattern: '/^[A-Za-z0-9]+$/', message: 'Password must not contain Cyrillic characters')]
    public string $password;
}