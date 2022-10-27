<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\DomainRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DomainRepository::class)]
#[ApiResource]
class Domain
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\OneToMany(mappedBy: 'domain', targetEntity: SubDomain::class)]
    private Collection $subDomains;

    public function __construct()
    {
        $this->subDomains = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return Collection<int, SubDomain>
     */
    public function getSubDomains(): Collection
    {
        return $this->subDomains;
    }

    public function addSubDomain(SubDomain $subDomain): self
    {
        if (!$this->subDomains->contains($subDomain)) {
            $this->subDomains->add($subDomain);
            $subDomain->setDomain($this);
        }

        return $this;
    }

    public function removeSubDomain(SubDomain $subDomain): self
    {
        if ($this->subDomains->removeElement($subDomain)) {
            // set the owning side to null (unless already changed)
            if ($subDomain->getDomain() === $this) {
                $subDomain->setDomain(null);
            }
        }

        return $this;
    }
}
