import { FastifyRequest, FastifyReply } from 'fastify'

// type FastifyRoute

export const get = async (req, res) => {
  let props = { customer: 'bob' }

  res.view('example', props)
  // res.status(200).send({
  //   cat: 'meows!'
  // })
}

// export const post = async (req: FastifyRequest, res: FastifyReply) => {}

// export const patch = async (req: FastifyRequest, res: FastifyReply) => {}

// export const del = async (req: FastifyRequest, res: FastifyReply) => {}
