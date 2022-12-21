<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture{
    private $userHasher;

    public function __construct(UserPasswordHasherInterface $userHasher){
        $this->userHasher = $userHasher;
    }

    public function load(ObjectManager $manager): void{
        $admin = new User();
        $admin->setEmail("admin@example.com")
        ->setUsername("admin")
        ->setRoles(["ROLE_ADMIN"])
        ->setPassword($this->userHasher->hashPassword($admin, "admin"));
        $manager->persist($admin);
        $manager->flush();

    }
}
