import { TextInput, TextInputProps } from 'react-native';

import { colors, spacing } from '@/src/theme/tokens';

export function AppInput(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      {...props}
      style={[
        {
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surfaceAlt,
          color: colors.text,
          borderRadius: 10,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          minHeight: 44,
        },
        props.style,
      ]}
    />
  );
}
