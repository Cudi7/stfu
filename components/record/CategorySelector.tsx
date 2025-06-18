import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategorySelectorProps {
  isDark: boolean;
  categories: Category[];
  selectedCategoryIds: Set<string>;
  generalCategoryId: string | null;
  isLoading: boolean;
  onToggleCategory: (categoryId: string) => void;
}

export function CategorySelector({
  isDark,
  categories,
  selectedCategoryIds,
  generalCategoryId,
  isLoading,
  onToggleCategory,
}: CategorySelectorProps) {
  return (
    <View
      className={`w-full p-3 rounded-lg mb-3 ${
        isDark
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-300"
      }`}
    >
      <Text
        className={`text-sm font-medium mb-2 ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        Select Categories (General is default)
      </Text>

      {isLoading ? (
        <ActivityIndicator color={isDark ? "#fff" : "#000"} />
      ) : categories.length === 0 ? (
        <Text className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          No categories available.
        </Text>
      ) : (
        <View className="flex-row flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategoryIds.has(category.id);
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => onToggleCategory(category.id)}
                className={`py-2 px-3 rounded-full border ${
                  isSelected
                    ? "bg-green-500 border-green-500"
                    : isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-200 border-gray-300"
                }`}
              >
                <Text
                  className={`text-sm ${
                    isSelected
                      ? "text-white"
                      : isDark
                      ? "text-gray-200"
                      : "text-gray-800"
                  }`}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
