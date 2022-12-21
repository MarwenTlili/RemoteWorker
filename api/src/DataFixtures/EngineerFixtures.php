<?php
namespace App\DataFixtures;

use App\Entity\Engineer;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class EngineerFixtures extends Fixture{
    private $userHasher;
    protected $faker;

    public function __construct(UserPasswordHasherInterface $userHasher){
        $this->userHasher = $userHasher;
    }

    public function load(ObjectManager $manager): void{
        $this->faker = Factory::create('fr_FR');

        for ($i=0; $i <4 ; $i++) {
            $genders = ['male', 'female'];
            $gender = array_rand($genders);
            $firstName = $this->faker->firstName($gender);
            $lastName = $this->faker->lastName();
            $username = "{$firstName}.{$lastName}";

            $user = new User();
            $user->setEmail("{$firstName}_{$lastName}@example.com")
            ->setUsername($username)
            ->setRoles(['ROLE_ENGINEER'])
            ->setPassword($this->userHasher->hashPassword($user, $username));
            $manager->persist($user);

            $engineer = new Engineer();
            $engineer->setFirstName($firstName);
            $engineer->setLastName($lastName);
            $engineer->setUserRef($user);
            $engineer->setExperience($this->faker->numberBetween(0, 10));
            $engineer->setDayRate($this->faker->numberBetween(80, 100));
            $engineer->setPresentation($this->faker->realText($maxNbChars = 200, $indexSize = 2));
            $engineer->setCountry($this->faker->country());
            $engineer->setCity($this->faker->city());
            $engineer->setPhone($this->faker->phoneNumber());
            $engineer->setGender($gender);
            $manager->persist($engineer);
        }

        $manager->flush();
    }

}



