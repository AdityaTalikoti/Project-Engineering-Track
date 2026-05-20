const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

async function createBooking({ userId, seatId, showId }) {
  try {
    // Directly create the booking without the false-security findFirst check
    const booking = await prisma.booking.create({
      data: {
        userId,
        seatId,
        showId
      }
    });

    return {
      success: true,
      booking
    };
  } catch (err) {
    // If the error is a Prisma unique constraint violation (P2002)
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return {
        success: false,
        status: 409,
        message: 'This seat is already booked for this show.'
      };
    }
    // Re-throw any other error
    throw err;
  }
}

module.exports = {
  createBooking
};
