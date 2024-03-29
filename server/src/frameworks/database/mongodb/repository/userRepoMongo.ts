import User from "../model/userModel";
import { UserRegisterInterface } from "../../../../types/user";
import { QuizInterface } from "../../../../types/quiz";
import Quiz from "../model/quizModel";
import QuizResult from "../model/quizResultModel";

export const userRepositoryMongoDB = () => {
  const addUser = async (user: UserRegisterInterface) => {
    return await User.create(user);
  };

  const getUserEmail = async (email: string) => {
    return await User.findOne({ email });
  };

  const getUserById = async (userId: string) => {
    return await User.findOne({ _id: userId });
  };

  const createQuiz = async (data: QuizInterface) => {
    return await Quiz.create(data);
  };

  const upgradeToPremium = async (userId: string) => {
    return await User.findByIdAndUpdate(
      userId,
      { premium: true },
      { new: true }
    );
  };

  const fetchAllQuiz = async () => {
    try {
      return await Quiz.aggregate([
        {
          $project: {
            category: 1,
            createdBy: 1,
            premium: 1,
            _id: 1,
          },
        },
      ]);
    } catch (error) {
      throw error;
    }
  };

  const fetchQuiz = async (quizId: string) => {
    try {
      return await Quiz.findOne({ _id: quizId });
    } catch (error) {
      throw error;
    }
  };

  const addQuizResult = async (obj: any) => {
    try {
      return await QuizResult.create(obj);
    } catch (error) {
      throw error;
    }
  };

  const userQuizResults = async (userId: string) => {
    try {
      return await QuizResult.aggregate([
        {
          $match: { userId: userId },
        },
        {
          $addFields: {
            quizObjectId: { $toObjectId: "$quizId" },
          },
        },
        {
          $lookup: {
            from: "quiz",
            localField: "quizObjectId",
            foreignField: "_id",
            as: "quiz",
          },
        },
        {
          $unwind: "$quiz",
        },
        {
          $project: {
            userId: 1,
            date: 1,
            TotalScore: 1,
            category: "$quiz.category",
            quizId: 1,
            Result: 1,
          },
        },
      ]);
    } catch (error) {
      throw error;
    }
  };

  return {
    addUser,
    getUserEmail,
    getUserById,
    createQuiz,
    upgradeToPremium,
    fetchAllQuiz,
    fetchQuiz,
    addQuizResult,
    userQuizResults,
  };
};

export type UserRepositoryMongoDB = typeof userRepositoryMongoDB;
