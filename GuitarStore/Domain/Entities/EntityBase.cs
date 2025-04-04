﻿namespace GuitarStore.Domain.Entities
{
    public abstract class EntityBase
    {
        public int Id { get; set; }

        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    }
}
