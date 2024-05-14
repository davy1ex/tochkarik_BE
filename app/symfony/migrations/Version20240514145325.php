<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240514145325 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE "posts" (
                id INT NOT NULL, 
                title VARCHAR(255) NOT NULL, 
                body TEXT NOT NULL, 
                coordinates VARCHAR(255) NOT NULL, 
                author VARCHAR(255) NOT NULL, 
                data_creation DATE NOT NULL, PRIMARY KEY(id)
       );');

        $this->addSql('CREATE TABLE "user" (id INT NOT NULL, username VARCHAR(255) NOT NULL, photo_profile VARCHAR(255) DEFAULT NULL, email VARCHAR(255) DEFAULT NULL, password VARCHAR(255) NOT NULL, role VARCHAR(255) NOT NULL, date_registration DATE NOT NULL, last_time_visited DATE NOT NULL, posts_count INT NOT NULL, comments_count INT NOT NULL, toch_coins INT NOT NULL, bookmarked_posts TEXT DEFAULT NULL, PRIMARY KEY(id));
');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
    }
}
