import HttpError from '../helpers/HttpError.js';
import { Notes } from '../models/notesModel.js';
import { googleDriveService } from '../service/googleDriveService.js';
import { userOwnership } from '../helpers/userOwnership.js';

export const getAllNotes = async (req, res) => {
  // const { _id: owner } = req.user; //owner - кожен користувач бачить тільки свої контакти
  // const { page = 1, limit = 20, favorite = null } = req.query;
  // const skip = (page - 1) * limit;
  // const filters = { owner };

  // if (favorite !== null) {
  //   filters.favorite = favorite;
  // }

  // const result = await Notes.find(filters, '-createdAt -updatedAt', { skip, limit }).populate(
  //   'owner',
  //   'email subscription'
  // );
  // res.status(200).json(result);

  //пагінація
  const { page = 1, limit = 20, favorite = null } = req.query;
  const skip = (page - 1) * limit;

  const result = await Notes.find({}, null, { skip, limit });
  res.status(200).json(result);
};

export const getOneNotes = async (req, res) => {
  // const { _id: owner } = req.user;
  // const { id } = req.params;
  // const result = await Notes.findOne({ owner, _id: id });
  // if (!result) {
  //   throw HttpError(404, 'Not found');
  // }
  // res.status(200).json(result);
  const { id } = req.params;
  const result = await Notes.findOne({ _id: id });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
};

export const deleteNotes = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  await userOwnership(id, owner, 'You are not authorized to delete this file');

  // Видаляємо запис
  const result = await Notes.findByIdAndDelete({ owner, _id: id });
  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.status(200).json(result);
};

// export const createNotes = async (req, res) => {
//   const { _id: owner } = req.user;
//   const result = await Notes.create({ ...req.body, owner });
//   res.status(201).json(result);
// };

export const createNotes = async (req, res) => {
  // Загрузка файла в Google Drive
  const fileData = await googleDriveService(req.file.path);

  const { _id: owner } = req.user;

  // Создание  fileURL с URL файла
  const result = await Notes.create({
    ...req.body,
    owner,
    fileURL: `https://drive.google.com/uc?export=view&id=${fileData.id}` || null,
  });

  res.status(201).json(result);
};

export const updateNotes = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw HttpError(400, 'Body must have at least one field');
  }

  const { _id: owner } = req.user;
  const { id } = req.params;

  await userOwnership(id, owner, 'You do not have permission to edit this file');

  const result = await Notes.findByIdAndUpdate(id, { ...req.body, owner }, { new: true });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
};

export const updateStatusNotes = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  await userOwnership(id, owner, 'You do not have permission to edit this file');

  const result = await Notes.findByIdAndUpdate(id, { ...req.body, owner }, { new: true });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
};

export const favoritesNotes = async (req, res) => {
  // Знаходження файлів, які улюблені для поточного користувача
  const { _id: owner } = req.user;
  const { favorite } = req.params;

  const favoriteNotes = await Notes.find({ owner, favorite: true });
  // const favoriteNotes = await Notes.find({ favorite: true });
  res.status(200).json(favoriteNotes);
};
