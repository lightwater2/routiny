import { forwardRef, type InputHTMLAttributes } from 'react';

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked = false,
      disabled = false,
      className = '',
      onChange,
      ...props
    },
    ref
  ) => {
    return (
      <label
        className={`
          relative inline-flex items-center cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <span
          className={`
            relative inline-flex items-center
            w-[51px] h-[30px]
            rounded-[15px]
            transition-colors duration-200 ease-in-out
            ${checked ? 'bg-[#3183F6]' : 'bg-[#E5E8EB]'}
          `}
        >
          <span
            className={`
              absolute
              w-[26px] h-[26px]
              bg-white
              rounded-full
              shadow-sm
              transition-transform duration-200 ease-in-out
              ${checked ? 'translate-x-[23px]' : 'translate-x-[2px]'}
            `}
          />
        </span>
      </label>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
