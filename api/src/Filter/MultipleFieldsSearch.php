<?php
namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Symfony\Component\PropertyInfo\Type;

class MultipleFieldsSearch extends AbstractFilter{
    private string $searchParameterName;

    function __construct(
        ManagerRegistry $managerRgistry,
        LoggerInterface $logger,
        array $properties = null,
        NameConverterInterface $nameConverter = null,
        string $searchParameterName = 'q'
    ){
        parent::__construct($managerRgistry, $logger, $properties, $nameConverter);
        $this->searchParameterName = $searchParameterName;
    }

    protected function filterProperty(
        string $property, $value, QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass,
        Operation $operation = null, array $context = []
    ): void {
        if (null === $value || $property !== $this->searchParameterName) {
            return;
        }

        $words = explode(' ', $value);
        foreach ($words as $word) {
            if (empty($word)){
                continue;
            }
            $this->addWhere($queryBuilder, $word, $queryNameGenerator->generateParameterName($property));
        }
    }

    private function addWhere($queryBuilder, $word, $parameterName)
    {
        $alias = $queryBuilder->getRootAliases()[0];

        // Build OR expression
        $orExp = $queryBuilder->expr()->orX();
        foreach ($this->getProperties() as $prop => $ignoored) {
            $orExp->add($queryBuilder->expr()->like('LOWER('. $alias. '.' . $prop. ')', ':' . $parameterName));
        }

        $queryBuilder
            ->andWhere('(' . $orExp . ')')
            ->setParameter($parameterName, '%' . strtolower($word). '%');
    }

    public function getDescription(string $resourceClass): array{
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $property => $strategy) {
            $description["search_$property"] = [
                'property' => $property,
                'type' => Type::BUILTIN_TYPE_STRING,
                'required' => false,
                'description' => 'Filter multiple fields. This will appear in the OpenApi documentation!',
                'openapi' => [
                    'example' => 'Custom example that will be in the documentation and be the default value of the sandbox',
                    'allowReserved' => false,// if true, query parameters will be not percent-encoded
                    'allowEmptyValue' => true,
                    'explode' => false, // to be true, the type must be Type::BUILTIN_TYPE_ARRAY, ?product=blue,green will be ?product=blue&product=green
                ],
            ];
        }

        return $description;
    }
}
