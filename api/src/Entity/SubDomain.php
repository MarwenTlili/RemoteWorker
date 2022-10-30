<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SubDomainRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SubDomainRepository::class)]
#[ApiResource]
class SubDomain
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy:"IDENTITY")]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\ManyToOne(inversedBy: 'subDomains')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Domain $domain = null;

    #[ORM\ManyToMany(targetEntity: Mission::class, inversedBy: 'subDomains')]
    private Collection $missionSubdomain;

    public function __construct()
    {
        $this->missionSubdomain = new ArrayCollection();
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

    public function getDomain(): ?Domain
    {
        return $this->domain;
    }

    public function setDomain(?Domain $domain): self
    {
        $this->domain = $domain;

        return $this;
    }

    /**
     * @return Collection<int, Mission>
     */
    public function getMissionSubdomain(): Collection
    {
        return $this->missionSubdomain;
    }

    public function addMissionSubdomain(Mission $missionSubdomain): self
    {
        if (!$this->missionSubdomain->contains($missionSubdomain)) {
            $this->missionSubdomain->add($missionSubdomain);
        }

        return $this;
    }

    public function removeMissionSubdomain(Mission $missionSubdomain): self
    {
        $this->missionSubdomain->removeElement($missionSubdomain);

        return $this;
    }
}
