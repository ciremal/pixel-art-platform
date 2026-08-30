import { useState } from 'react'
import './style.css'

type DropdownOption = {
  label: string
  value: string
}

type DropdownProps = {
  options: DropdownOption[]
  value?: string
  placeholder?: string
  onChange?: (value: any) => void
  disabled?: boolean
}

const Dropdown = ({
  options,
  value,
  placeholder = 'Select an option',
  onChange,
  disabled = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (option: DropdownOption) => {
    onChange?.(option.value)
    setIsOpen(false)
  }

  return (
    <div className="dropdown">
      <button
        className="dropdown-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={disabled}
        type="button"
      >
        <span>
          {selectedOption?.label ?? placeholder}
        </span>

        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <button
              key={option.value}
              className={`dropdown-option ${
                option.value === value ? 'selected' : ''
              }`}
              onClick={() => handleSelect(option)}
              type="button"
            >
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown