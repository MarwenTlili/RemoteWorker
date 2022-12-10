<?php

namespace App\State;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;

class UserStateProvider implements ProviderInterface
{
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): Object{
        if ($operation instanceof CollectionOperationInterface) {
            return [new User(), new User()];
        }
        return new User($uriVariables['id']);
    }
}
