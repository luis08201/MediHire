import type { EmploymentType, WorkArrangement } from '../../data/types.ts'
import {
  employmentTypes,
  toggleInList,
  workArrangements,
  type JobFilters,
} from '../../lib/jobBoard.ts'

type JobFilterGroupsProps = {
  idPrefix: string
  values: JobFilters
  specialties: string[]
  locations: string[]
  onChange: (next: JobFilters) => void
}

function fieldId(prefix: string, group: string, value: string) {
  return `${prefix}-${group}-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

function CheckGroup<T extends string>({
  legend,
  name,
  options,
  selected,
  idPrefix,
  group,
  onToggle,
}: {
  legend: string
  name: string
  options: readonly T[]
  selected: readonly T[]
  idPrefix: string
  group: string
  onToggle: (value: T) => void
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 text-sm font-semibold text-heading">{legend}</legend>
      <div className="space-y-1">
        {options.map((option) => {
          const id = fieldId(idPrefix, group, option)

          return (
            <label
              key={option}
              htmlFor={id}
              className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-body"
            >
              <input
                id={id}
                name={name}
                type="checkbox"
                className="size-4 accent-primary"
                checked={selected.includes(option)}
                onChange={() => onToggle(option)}
              />
              <span>{option}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function JobFilterGroups({
  idPrefix,
  values,
  specialties,
  locations,
  onChange,
}: JobFilterGroupsProps) {
  return (
    <div className="space-y-8">
      <CheckGroup
        legend="Specialty"
        name={`${idPrefix}-specialty`}
        options={specialties}
        selected={values.specialties}
        idPrefix={idPrefix}
        group="specialty"
        onToggle={(value) =>
          onChange({ ...values, specialties: toggleInList(values.specialties, value) })
        }
      />
      <CheckGroup
        legend="Location"
        name={`${idPrefix}-location`}
        options={locations}
        selected={values.locations}
        idPrefix={idPrefix}
        group="location"
        onToggle={(value) =>
          onChange({ ...values, locations: toggleInList(values.locations, value) })
        }
      />
      <CheckGroup<WorkArrangement>
        legend="Work Arrangement"
        name={`${idPrefix}-arrangement`}
        options={workArrangements}
        selected={values.arrangements}
        idPrefix={idPrefix}
        group="arrangement"
        onToggle={(value) =>
          onChange({ ...values, arrangements: toggleInList(values.arrangements, value) })
        }
      />
      <CheckGroup<EmploymentType>
        legend="Employment Type"
        name={`${idPrefix}-employment`}
        options={employmentTypes}
        selected={values.employmentTypes}
        idPrefix={idPrefix}
        group="employment"
        onToggle={(value) =>
          onChange({
            ...values,
            employmentTypes: toggleInList(values.employmentTypes, value),
          })
        }
      />
    </div>
  )
}
