<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20221030104024 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE api_token (id SERIAL NOT NULL, user_ref_id INT NOT NULL, token VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_7BA2F5EB44E55A94 ON api_token (user_ref_id)');
        $this->addSql('ALTER TABLE api_token ADD CONSTRAINT FK_7BA2F5EB44E55A94 FOREIGN KEY (user_ref_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "user" ALTER roles TYPE TEXT');
        $this->addSql('COMMENT ON COLUMN "user".roles IS \'(DC2Type:simple_array)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE api_token DROP CONSTRAINT FK_7BA2F5EB44E55A94');
        $this->addSql('DROP TABLE api_token');
        $this->addSql('ALTER TABLE "user" ALTER roles TYPE JSON');
        $this->addSql('COMMENT ON COLUMN "user".roles IS NULL');
    }
}
