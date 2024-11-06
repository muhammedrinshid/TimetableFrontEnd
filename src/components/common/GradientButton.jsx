import React from "react";

const GradientButton = ({
  children,
  variant = "primary",
  disabled = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:scale-105";

  const variants = {
    // Primary uses the main brand color (#312ECB) and its shades
    primary:
      "bg-gradient-to-r from-[#312ECB] via-[#7874E0] to-[#312ECB] hover:from-[#464691] hover:via-[#5e5eb3] hover:to-[#464691] text-white shadow-lg shadow-[#312ECB]/30 hover:shadow-[#312ECB]/40 focus:ring-[#312ECB]",

    // Secondary using the secondary color (#7874E0)
    secondary:
      "bg-gradient-to-r from-[#7874E0] via-[#715DF1] to-[#7874E0] hover:from-[#6666d2] hover:via-[#5353b4] hover:to-[#6666d2] text-white shadow-lg shadow-[#7874E0]/30 hover:shadow-[#7874E0]/40 focus:ring-[#7874E0]",

    // Light version using background shades
    light:
      "bg-gradient-to-r from-[#ecf3fa] via-[#DFDFDF] to-[#ecf3fa] hover:from-[#e7e7f8] hover:via-[#cfcff1] hover:to-[#e7e7f8] text-[#312ECB] shadow-lg shadow-[#312ECB]/10 hover:shadow-[#312ECB]/20 focus:ring-[#312ECB]",

    // Dark mode version
    dark: "bg-gradient-to-r from-[#1f1f1f] via-[#2a2a2a] to-[#1f1f1f] hover:from-[#111827] hover:via-[#1f2937] hover:to-[#111827] text-white shadow-lg shadow-black/30 hover:shadow-black/40 focus:ring-[#312ECB]",
  };

  const disabledStyles =
    "cursor-not-allowed pointer-events-none bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 dark:from-gray-700 dark:to-gray-800 dark:text-gray-500 shadow-none";

  return (
    <button
      className={`${baseStyles} ${
        disabled ? disabledStyles : variants[variant]
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};


export default GradientButton;
