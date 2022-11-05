<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20221105112222 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE certification (id SERIAL NOT NULL, engineer_id INT NOT NULL, title VARCHAR(255) NOT NULL, company_name VARCHAR(255) NOT NULL, start_date DATE NOT NULL, end_date DATE DEFAULT NULL, current BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_6C3C6D75F8D8CDF1 ON certification (engineer_id)');
        $this->addSql('CREATE TABLE client (id SERIAL NOT NULL, user_ref_id INT NOT NULL, name VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, presentation TEXT DEFAULT NULL, country VARCHAR(255) DEFAULT NULL, city VARCHAR(255) DEFAULT NULL, phone VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C744045544E55A94 ON client (user_ref_id)');
        $this->addSql('CREATE TABLE domain (id SERIAL NOT NULL, title VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE engineer (id SERIAL NOT NULL, user_ref_id INT NOT NULL, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, experience INT DEFAULT NULL, day_rate INT DEFAULT NULL, presentation TEXT DEFAULT NULL, country VARCHAR(255) DEFAULT NULL, city VARCHAR(255) DEFAULT NULL, phone VARCHAR(255) DEFAULT NULL, photo VARCHAR(255) DEFAULT NULL, gender VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_94176AD944E55A94 ON engineer (user_ref_id)');
        $this->addSql('CREATE TABLE experience (id SERIAL NOT NULL, engineer_id INT NOT NULL, title VARCHAR(255) NOT NULL, company_name VARCHAR(255) NOT NULL, start_date DATE NOT NULL, end_date DATE DEFAULT NULL, current BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_590C103F8D8CDF1 ON experience (engineer_id)');
        $this->addSql('CREATE TABLE mission (id SERIAL NOT NULL, client_id INT NOT NULL, title VARCHAR(255) NOT NULL, description TEXT NOT NULL, budget NUMERIC(10, 3) NOT NULL, start_date DATE NOT NULL, end_date DATE NOT NULL, affected BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_9067F23C19EB6921 ON mission (client_id)');
        $this->addSql('CREATE TABLE quote (id SERIAL NOT NULL, engineer_id INT NOT NULL, mission_id INT NOT NULL, proposed_price NUMERIC(10, 3) NOT NULL, number_of_days INT NOT NULL, start_at DATE NOT NULL, date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, confirmed BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_6B71CBF4F8D8CDF1 ON quote (engineer_id)');
        $this->addSql('CREATE INDEX IDX_6B71CBF4BE6CAE90 ON quote (mission_id)');
        $this->addSql('CREATE TABLE study (id SERIAL NOT NULL, engineer_id INT NOT NULL, title VARCHAR(255) NOT NULL, university VARCHAR(255) NOT NULL, start_date DATE NOT NULL, end_date DATE DEFAULT NULL, current BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_E67F9749F8D8CDF1 ON study (engineer_id)');
        $this->addSql('CREATE TABLE sub_domain (id SERIAL NOT NULL, domain_id INT NOT NULL, title VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_15F85147115F0EE5 ON sub_domain (domain_id)');
        $this->addSql('CREATE TABLE sub_domain_mission (sub_domain_id INT NOT NULL, mission_id INT NOT NULL, PRIMARY KEY(sub_domain_id, mission_id))');
        $this->addSql('CREATE INDEX IDX_1314B930352485B ON sub_domain_mission (sub_domain_id)');
        $this->addSql('CREATE INDEX IDX_1314B930BE6CAE90 ON sub_domain_mission (mission_id)');
        $this->addSql('CREATE TABLE "user" (id SERIAL NOT NULL, email VARCHAR(180) NOT NULL, username VARCHAR(255) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('ALTER TABLE certification ADD CONSTRAINT FK_6C3C6D75F8D8CDF1 FOREIGN KEY (engineer_id) REFERENCES engineer (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE client ADD CONSTRAINT FK_C744045544E55A94 FOREIGN KEY (user_ref_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE engineer ADD CONSTRAINT FK_94176AD944E55A94 FOREIGN KEY (user_ref_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE experience ADD CONSTRAINT FK_590C103F8D8CDF1 FOREIGN KEY (engineer_id) REFERENCES engineer (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE mission ADD CONSTRAINT FK_9067F23C19EB6921 FOREIGN KEY (client_id) REFERENCES client (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE quote ADD CONSTRAINT FK_6B71CBF4F8D8CDF1 FOREIGN KEY (engineer_id) REFERENCES engineer (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE quote ADD CONSTRAINT FK_6B71CBF4BE6CAE90 FOREIGN KEY (mission_id) REFERENCES mission (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE study ADD CONSTRAINT FK_E67F9749F8D8CDF1 FOREIGN KEY (engineer_id) REFERENCES engineer (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE sub_domain ADD CONSTRAINT FK_15F85147115F0EE5 FOREIGN KEY (domain_id) REFERENCES domain (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE sub_domain_mission ADD CONSTRAINT FK_1314B930352485B FOREIGN KEY (sub_domain_id) REFERENCES sub_domain (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE sub_domain_mission ADD CONSTRAINT FK_1314B930BE6CAE90 FOREIGN KEY (mission_id) REFERENCES mission (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE certification DROP CONSTRAINT FK_6C3C6D75F8D8CDF1');
        $this->addSql('ALTER TABLE client DROP CONSTRAINT FK_C744045544E55A94');
        $this->addSql('ALTER TABLE engineer DROP CONSTRAINT FK_94176AD944E55A94');
        $this->addSql('ALTER TABLE experience DROP CONSTRAINT FK_590C103F8D8CDF1');
        $this->addSql('ALTER TABLE mission DROP CONSTRAINT FK_9067F23C19EB6921');
        $this->addSql('ALTER TABLE quote DROP CONSTRAINT FK_6B71CBF4F8D8CDF1');
        $this->addSql('ALTER TABLE quote DROP CONSTRAINT FK_6B71CBF4BE6CAE90');
        $this->addSql('ALTER TABLE study DROP CONSTRAINT FK_E67F9749F8D8CDF1');
        $this->addSql('ALTER TABLE sub_domain DROP CONSTRAINT FK_15F85147115F0EE5');
        $this->addSql('ALTER TABLE sub_domain_mission DROP CONSTRAINT FK_1314B930352485B');
        $this->addSql('ALTER TABLE sub_domain_mission DROP CONSTRAINT FK_1314B930BE6CAE90');
        $this->addSql('DROP TABLE certification');
        $this->addSql('DROP TABLE client');
        $this->addSql('DROP TABLE domain');
        $this->addSql('DROP TABLE engineer');
        $this->addSql('DROP TABLE experience');
        $this->addSql('DROP TABLE mission');
        $this->addSql('DROP TABLE quote');
        $this->addSql('DROP TABLE study');
        $this->addSql('DROP TABLE sub_domain');
        $this->addSql('DROP TABLE sub_domain_mission');
        $this->addSql('DROP TABLE "user"');
    }
}
