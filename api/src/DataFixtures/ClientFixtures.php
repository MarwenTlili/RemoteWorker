<?php
namespace App\DataFixtures;

use App\Entity\Client;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class ClientFixtures extends Fixture{
    private $userHasher;
    protected $faker;

    public function __construct(UserPasswordHasherInterface $userHasher){
        $this->userHasher = $userHasher;
    }

    public function load(ObjectManager $manager): void{
        $this->faker = Factory::create('fr_FR');

        for ($i=0; $i <6 ; $i++) {
            $genders = ['male', 'female'];
            $gender = array_rand($genders);
            $firstName = $this->faker->firstName($gender);
            $lastName = $this->faker->lastName();
            $username = "{$firstName}.{$lastName}";

            $user = new User();
            $user->setEmail("{$firstName}_{$lastName}@example.com")
            ->setUsername($username)
            ->setRoles(['ROLE_CLIENT'])
            ->setPassword($this->userHasher->hashPassword($user, $username));
            $manager->persist($user);

            $client = new Client();
            $client->setName($this->faker->company());
            $client->setAddress($this->faker->address());
            $client->setCountry($this->faker->country());
            $client->setCity($this->faker->city());
            $client->setPhone($this->faker->phoneNumber());
            $client->setUserRef($user);
            $manager->persist($client);
        }

        $manager->flush();
    }

}
