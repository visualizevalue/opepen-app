export const COLORS = {
  gray000: '#101010',
  gray100: '#131313',
  gray200: '#1C1C1C',
  gray300: '#262626',
  gray400: '#2F2F2F',
  gray500: '#696969',
  gray600: '#ADADAD',
  gray700: '#D8D8D8',
  gray800: '#E6E6E6',
  gray900: '#F2F2F2',
  gray999: '#F8F8F8',
}

export const Z_COLORS = computed(() =>
  isDark.value
    ? {
        grayZ1: COLORS.gray100,
        grayZ2: COLORS.gray200,
        grayZ8: COLORS.gray800,
        grayZ9: COLORS.gray900,
      }
    : {
        grayZ1: COLORS.gray900,
        grayZ2: COLORS.gray800,
        grayZ8: COLORS.gray200,
        grayZ9: COLORS.gray100,
      },
)

const isDark = ref(true)
export const borderColor = computed(() => (isDark.value ? COLORS.gray400 : COLORS.gray600))
