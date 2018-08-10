using PruebaKnockout.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace PruebaKnockout.Controllers
{
    public class CarrerasController : ApiController
    {
        private Meucci3Entities db = new Meucci3Entities();

        // GET api/Carreras
        public IEnumerable<Carreras> GetCarreras()
        {
            return db.Carreras.ToList();
        }

        // GET api/Carreras/5
        public Carreras GetCarreras(int id)
        {
            Carreras carreras = db.Carreras.Find(id);
            if (carreras == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return carreras;
        }

        // PUT api/Carreras/5
        public HttpResponseMessage PutCarreras(int id, Carreras carreras)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != carreras.crrCarreraId)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            db.Entry(carreras).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        // POST api/Carreras
        public HttpResponseMessage PostCarreras(Carreras carreras)
        {
            if (ModelState.IsValid)
            {
                db.Carreras.Add(carreras);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, carreras);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = carreras.crrCarreraId }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // DELETE api/Carreras/5
        public HttpResponseMessage DeleteCarreras(int id)
        {
            Carreras carreras = db.Carreras.Find(id);
            if (carreras == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Carreras.Remove(carreras);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, carreras);
        }


        [HttpGet]
        public HttpResponseMessage getCareerbyEmployee()
        {



            List<CareerData> result = new List<CareerData>();


            List<int> idEmpleados = new List<int>();

            idEmpleados = (from car in db.Carreras select car.empEmpleadoIdCreador.GetValueOrDefault()).Distinct().ToList();


        

            foreach (int item in idEmpleados)
            {

                int cant = 0;
                cant = db.Carreras.Where(c => c.empEmpleadoIdCreador == Convert.ToInt32(item)).Count();

                if (cant < 0)
                {
                    result.Add(new CareerData()
                    {
                        idEmpleado = Convert.ToInt32(item),
                        Cantidad = cant
                    });
                }
            }

            if (result != null)
            {
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }


            return Request.CreateResponse(HttpStatusCode.BadRequest,"La lista para le gráfico está vacío");


        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}