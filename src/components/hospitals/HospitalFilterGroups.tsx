import { toggleInList, type HospitalFilters } from '../../lib/hospitalDirectory.ts'

type HospitalFilterGroupsProps = {
  idPrefix: string
  values: HospitalFilters
  locations: string[]
  specialties: string[]
  onChange: (next: HospitalFilters) => void
}

function fieldId(prefix: string, group: string, value: string) {
  return `${prefix}-${group}-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

export function HospitalFilterGroups({
  idPrefix,
  values,
  locations,
  specialties,
  onChange,
}: HospitalFilterGroupsProps) {
  return (
    <div className="grid gap-8">
      <fieldset className="border-0 p-0">
        <legend className="mb-2 text-sm font-semibold text-heading">Location</legend>
        <div className="grid gap-1 sm:grid-cols-2">
          {locations.map((location) => {
            const id = fieldId(idPrefix, 'location', location)
            return (
              <label key={location} htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                <input
                  id={id}
                  name={`${idPrefix}-location`}
                  type="checkbox"
                  className="size-4 accent-primary"
                  checked={values.locations.includes(location)}
                  onChange={() =>
                    onChange({ ...values, locations: toggleInList(values.locations, location) })
                  }
                />
                <span>{location}</span>
              </label>
            )
          })}
        </div>
      </fieldset>
      <fieldset className="border-0 p-0">
        <legend className="mb-2 text-sm font-semibold text-heading">Specialty</legend>
        <div className="grid gap-1 sm:grid-cols-2">
          {specialties.map((specialty) => {
            const id = fieldId(idPrefix, 'specialty', specialty)
            return (
              <label key={specialty} htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                <input
                  id={id}
                  name={`${idPrefix}-specialty`}
                  type="checkbox"
                  className="size-4 accent-primary"
                  checked={values.specialties.includes(specialty)}
                  onChange={() =>
                    onChange({
                      ...values,
                      specialties: toggleInList(values.specialties, specialty),
                    })
                  }
                />
                <span>{specialty}</span>
              </label>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}
