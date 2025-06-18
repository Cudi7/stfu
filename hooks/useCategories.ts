import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(
    new Set(),
  );
  const [generalCategoryId, setGeneralCategoryId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug");

    console.log("fetching categories...");

    if (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Could not load categories.");
    } else if (data) {
      setCategories(data);
      const generalCat = data.find((cat) => cat.slug === "general");
      if (generalCat) {
        setGeneralCategoryId(generalCat.id);
        setSelectedCategoryIds(new Set([generalCat.id]));
      }
    }
    setIsLoading(false);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) => {
      const newSet = new Set(prev);
      const isSelected = newSet.has(categoryId);

      if (isSelected) {
        // Prevent unselecting "general" if it's the only one selected
        if (categoryId === generalCategoryId && newSet.size === 1) {
          Alert.alert(
            "Default Category",
            "'General' category cannot be unselected if it's the only one.",
          );
          return newSet;
        }
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const resetToDefault = () => {
    if (generalCategoryId) {
      setSelectedCategoryIds(new Set([generalCategoryId]));
    } else {
      setSelectedCategoryIds(new Set());
    }
  };

  return {
    categories,
    selectedCategoryIds,
    generalCategoryId,
    isLoading,
    toggleCategory,
    resetToDefault,
  };
}
