<?php
namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\PropertyInfo\Type;

class CustomAndFilter extends AbstractFilter{
    protected function filterProperty(
        string $property, $value, QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass,
        Operation $operation = null, array $context = []
    ): void {
        $rootAlias = $queryBuilder->getRootAliases()[0];
        foreach (array_keys($this->getProperties()) as $prop) { //NOTE: we use array_keys because getProperties() returns a map of property => strategy
            if (!$this->isPropertyEnabled($prop, $resourceClass) || !$this->isPropertyMapped($prop, $resourceClass)) {
                return;
            }
            $parameterName = $queryNameGenerator->generateParameterName($prop);
            $queryBuilder
                ->andWhere(sprintf('%s.%s LIKE :%s', $rootAlias, $prop, $parameterName))
                ->setParameter($parameterName, "%" . $value . "%");
        }
    }

    public function getDescription(string $resourceClass): array{
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $property => $strategy) {
            $description["regexp_$property"] = [
                'property' => $property,
                'type' => Type::BUILTIN_TYPE_STRING,
                'required' => false,
                'description' => 'Filter using a regex. This will appear in the OpenApi documentation!',
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
