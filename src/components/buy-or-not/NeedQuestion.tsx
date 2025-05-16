import React from 'react';
import { BaseQuestion, type BaseQuestionProps } from './BaseQuestion';

export function NeedQuestion(
  props: Omit<BaseQuestionProps, 'title' | 'description'>,
) {
  return (
    <BaseQuestion
      title="Do you need this item?"
      description="Consider if this item is essential for your daily life or if it's just a want."
      {...props}
    />
  );
}
