<?php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\ApiToken;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class UsersTest extends ApiTestCase{
    use RefreshDatabaseTrait;

    private HttpClientInterface $client;
    private EntityManagerInterface $entityManager;
    private const API_TOKEN = 'd5b47b967c39d0a05eaa525c41f0e46eae04df96d7bcfe5b21eca40c6b13bd025c49e02bb3dddd1fb16c43766fc8905dbec9d03063af0653c84ac7ac';

    protected function setUp(): void{
        $this->client = $this->createClient();
        $this->entityManager = $this->client->getContainer()->get('doctrine')->getManager();

        $this->user = new User();
        $this->user->setEmail('admin@example.com');
        $this->user->setUsername('admin');
        $this->user->setRoles(['ROLE_ADMIN']);
        $this->user->setPassword('admin');
        $this->entityManager->persist($this->user);
        $this->entityManager->flush();

        $apiToken = new ApiToken();
        $apiToken->setToken(self::API_TOKEN);
        $apiToken->setUser($this->user);

        $this->entityManager->persist($apiToken);
        $this->entityManager->flush();
    }

    public function testGetCollection(): void{
        // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
        $response = $this->client->request(
            'GET',
            '/api/users',
            ['headers' => ['X-AUTH-TOKEN' => self::API_TOKEN]]
        );

        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/contexts/User',
            '@id' => '/api/users',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 11
        ]);

        // Because test fixtures are automatically loaded between each test, you can assert on them
        $this->assertCount(11, $response->toArray()['hydra:member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        // This generated JSON Schema is also used in the OpenAPI spec!
        $this->assertMatchesResourceCollectionJsonSchema(User::class);
    }

    public function testUnvalidToken(): void{
        $this->client->request(
            'GET',
            '/api/users',
            ['headers' => ['X-AUTH-TOKEN' => 'd5b47b967c39d0a05eaa525c41f0e46eae04df96d7bcfe5b21eca40c6b13bd025c49e02bb3dddd1fb16c43766fc8905dbec9d03063af0653c84ac7ad']]
        );
        $this->assertResponseStatusCodeSame(401);
        $this->assertJsonContains(
            [
                'message' => 'Invalid credentials.'
            ]
        );
    }

    public function testNoApiTokenProvided(): void{
        $this->client->request(
            'GET',
            '/api/users',

        );
        $this->assertResponseStatusCodeSame(401);
        $this->assertJsonContains(
            [
                'message' => 'No API Token provided'
            ]
        );
    }

    public function testCreateUser(): void{
        $response = $this->client->request('POST', '/api/users',
            [
                'headers' => ['X-AUTH-TOKEN' => self::API_TOKEN],
                'json' => [
                    'email' => 'engineer1@example.com',
                    'username' => 'engineer1',
                    'roles' => ['ROLE_ENGINEER'],
                    'password' => '$2y$13$wT2YfBL/.iJ1/YLLCcIKf.IpfXnUBu9b7aK7vMeXTvCs66ctkD/mW',
                ]

            ]
        );

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/User',
            '@type' => 'User',
            'email' => 'engineer1@example.com',
            'username' => 'engineer1',
            'roles' => [
                'ROLE_ENGINEER'
            ],
            'password' => '$2y$13$wT2YfBL/.iJ1/YLLCcIKf.IpfXnUBu9b7aK7vMeXTvCs66ctkD/mW',
            'apiTokens' => [],
            'userIdentifier' => 'engineer1@example.com'
        ]);
        $this->assertMatchesRegularExpression('~^/api/users/\d+$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(User::class);
    }

    public function testUpdateUser(): void{
        $iri = $this->findIriBy(User::class, ['email' => 'obins@ledner.com']);
        $this->client->request('PUT', $iri, [
            'headers' => ['X-AUTH-TOKEN' => self::API_TOKEN],
            'json' => [
                'username' => 'updated_username'
            ]
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'email' => 'obins@ledner.com',
            'username' => 'updated_username',
        ]);
    }

    public function testDeleteUser(): void{
        $iri = $this->findIriBy(User::class, ['email' => 'lincoln72@strosin.net']);
        $this->client->request('DELETE', $iri, ['headers' => ['X-AUTH-TOKEN' => self::API_TOKEN]]);
        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            static::getContainer()->get('doctrine')->getRepository(User::class)->findOneBy(
                ['email' => 'lincoln72@strosin.net']
            )
        );
    }
}
