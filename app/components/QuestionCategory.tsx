import { 
  UserGroupIcon, 
  TrophyIcon, 
  HeartIcon, 
  BanknotesIcon,
  ClockIcon,
  FlagIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';

type CategoryType = 'relationships' | 'achievements' | 'rituals' | 'wealth_experience' | 'mission' | 'vision' | 'values';
type TimeframeType = 'one_week' | 'ninety_day' | 'one_year' | 'long_term' | 'foundation';

interface QuestionCategoryProps {
  category: CategoryType;
  timeframe: TimeframeType;
}

const categoryConfig = {
  relationships: {
    icon: UserGroupIcon,
    label: 'Relationships',
    color: 'text-blue-600'
  },
  achievements: {
    icon: TrophyIcon,
    label: 'Achievements',
    color: 'text-yellow-600'
  },
  rituals: {
    icon: HeartIcon,
    label: 'Rituals',
    color: 'text-red-600'
  },
  wealth_experience: {
    icon: BanknotesIcon,
    label: 'Wealth & Experience',
    color: 'text-green-600'
  },
  mission: {
    icon: FlagIcon,
    label: 'Mission',
    color: 'text-purple-600'
  },
  vision: {
    icon: EyeIcon,
    label: 'Vision',
    color: 'text-indigo-600'
  },
  values: {
    icon: StarIcon,
    label: 'Values',
    color: 'text-pink-600'
  }
};

const timeframeConfig = {
  foundation: {
    label: 'Foundation',
    color: 'text-purple-600'
  },
  one_week: {
    label: '1 Week',
    color: 'text-violet-600'
  },
  ninety_day: {
    label: '90 Days',
    color: 'text-indigo-600'
  },
  one_year: {
    label: '1 Year',
    color: 'text-blue-600'
  },
  long_term: {
    label: '10-25 Years',
    color: 'text-cyan-600'
  }
};

export function QuestionCategory({ category, timeframe }: QuestionCategoryProps) {
  const categoryData = categoryConfig[category];
  const timeframeData = timeframeConfig[timeframe];
  const IconComponent = categoryData?.icon || StarIcon; // Fallback to StarIcon if no icon found

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-2 rounded-lg ${categoryData?.color || 'text-gray-600'} bg-white/50 backdrop-blur-sm`}>
        <IconComponent className="w-6 h-6" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${timeframeData?.color || 'text-gray-600'}`}>
            <ClockIcon className="w-4 h-4 inline mr-1" />
            {timeframeData?.label || 'Foundation'}
          </span>
        </div>
        <span className={`text-lg font-semibold ${categoryData?.color || 'text-gray-600'}`}>
          {categoryData?.label || 'General'}
        </span>
      </div>
    </div>
  );
} 