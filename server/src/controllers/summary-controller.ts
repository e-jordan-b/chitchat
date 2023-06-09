import { Request, Response } from 'express';
import { fetchRoomSummariesFromUrl } from '../models/room-model';
import { ErrorMessage } from '../models/error-message';
import { editSummaryById, fetchUserSummaries } from '../models/summary-model';
import sanitizeHtml from 'sanitize-html';
import { createFinalSummary } from '../scheduler/scheduler';
import { AuthenticatedRequest } from '../models/authenticated-request';

// Fetch
export const fetchSummaries = async (req: Request, res: Response) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    res.status(500).send(ErrorMessage.Error500);
    return;
  }

  const { summaries, error } = await fetchRoomSummariesFromUrl(url);

  if (!summaries || error) {
    res.status(500).send(ErrorMessage.Error500);
    return;
  }

  res.status(200).json(summaries);
};

// Edit
export const editSummary = async (req: Request, res: Response) => {
  const { summaryId, text } = req.body;

  if (
    !summaryId ||
    !text ||
    typeof summaryId !== 'string' ||
    typeof text !== 'string'
  ) {
    res.status(500).send(ErrorMessage.Error500);
    return;
  }

  // PURIFY, SAVE

  const cleanText = sanitizeHtml(text, {
    allowedTags: ['strong', 'em', 'u'],
    allowedAttributes: false,
  })

  console.log(cleanText);

  const { summary, error } = await editSummaryById(summaryId, cleanText);

  if (!summary || error) {
    res.status(500).send(ErrorMessage.Error500);
    return;
  }

  res.status(200).json(summary);
};


//final summary
export const getFinalSummary = async (req: Request, res: Response ) => {
  const { url } = req.body;

  const { summaries, error } = await fetchRoomSummariesFromUrl(url);

  if (!summaries || error) {
    res.status(500).send(ErrorMessage.Error500);
    return;
  }

  const finalSummary = await createFinalSummary(summaries, url);

  if (!finalSummary) {
    res.status(500).send(ErrorMessage.Error500);
    return;
  }

  res.status(201).json(finalSummary);
}

export const getSummariesByUserId = async (req: AuthenticatedRequest, res: Response) => {

  // was the easiest fix instead of having to come up with a different way to handle it in the frontend
  const userId = req.token!.id

  const { rooms, error } = await fetchUserSummaries(userId);

  if (!rooms || error) {
    res.status(500).send(ErrorMessage.Error500);
    return;
  }

  res.status(200).json(rooms);
}