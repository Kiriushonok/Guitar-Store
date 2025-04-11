using System;
using System.ComponentModel.DataAnnotations;

namespace GuitarStore.Domain.Attributes
{
    public class YearRangeAttribute : ValidationAttribute
    {
        private readonly int _minYear;

        public YearRangeAttribute(int minYear)
        {
            _minYear = minYear;
        }

        public override bool IsValid(object? value)
        {
            if (value is int year)
            {
                int currentYear = DateTime.Now.Year;
                return year >= _minYear && year <= currentYear;
            }
            return false;
        }

        public override string FormatErrorMessage(string name)
        {
            return $"Год выпуска должен быть между {_minYear} и {DateTime.Now.Year}";
        }
    }
}
