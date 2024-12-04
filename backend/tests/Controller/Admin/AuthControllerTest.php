<?php

namespace App\Tests\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AuthControllerTest extends WebTestCase
{
    public function testAppLoginPage()
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/admin/auth/signin');

        $this->assertResponseIsSuccessful();
        $this->assertSelectorTextContains('h1', 'Sign In');
    }

    public function testAppRegisterPage()
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/admin/auth/signup');

        $this->assertResponseIsSuccessful();
        $this->assertSelectorTextContains('h1', 'Sign Up');
    }

    public function testAppLogout()
    {
        $client = static::createClient();
        $client->request('GET', '/admin/auth/logout');

        $this->assertResponseStatusCodeSame(302);
        $client->followRedirect();

        $this->assertSelectorTextContains('h1', 'Sign In');
    }
}
